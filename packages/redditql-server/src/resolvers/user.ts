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
import { COOKIE_NAME } from "../constants";
import { validateRegister } from "../utils/validateRegister";

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
