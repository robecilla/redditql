import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { hash, verify } from "argon2";
import { User } from "../entities/User";
import { Context } from "src/types";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { prisma, req, redis }: Context
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "needs to be longer than 3 characters",
          },
        ],
      };
    }

    const redisKey = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(redisKey);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        password: await hash(newPassword),
      },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    // invalidate change password token after it's used
    await redis.del(redisKey);

    // @ts-ignore
    // log in user
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { prisma, redis }: Context
  ) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // there's no user with this email, do nothing
      return true;
    }

    const token = v4();
    const threeDays = 1000 * 60 * 60 * 24 * 3;

    await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "ex", threeDays);

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { prisma, req }: Context): Promise<User | null> | null {
    // @ts-ignore
    const userId = req.session.userId;
    if (!userId) return null;
    return prisma.user.findUnique({ where: { id: userId } });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { email, username, password }: UsernamePasswordInput,
    @Ctx() { prisma, req }: Context
  ): Promise<UserResponse> {
    if (await prisma.user.findUnique({ where: { username } })) {
      return {
        errors: [
          {
            field: "username",
            message: "that username already exists",
          },
        ],
      };
    }

    const errors = validateRegister({ email, username, password });

    if (errors) {
      return { errors };
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: await hash(password),
      },
    });

    // @ts-ignore
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { prisma, req }: Context
  ): Promise<UserResponse> {
    const isEmail = usernameOrEmail.includes("@");
    const user = await prisma.user.findUnique(
      isEmail
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "invalid username or email",
          },
        ],
      };
    }

    const isValid = await verify(user.password, password);
    if (!isValid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    // @ts-ignore
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
