import { prisma } from "../config/db.js";
import authService from "../services/authService.js";

export class AuthThirdPartyService {
  async createOrFetchUser(email, name, authProvider, idInProviderDB) {
    let user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          isVerified: true,
          authProvider,
          idInProviderDB,
        },
      });
    }
    return user;
  }

  async generateJwt(user) {
    const { accessToken, type, expiresIn } =
      authService.generateAccessToken(user);
    const [refreshToken] = await Promise.all([
      authService.generateRefreshToken(user),
      authService.sendOtpMail(user, true),
    ]);

    return {
      data: {
        accessToken: {
          token: accessToken,
          type: type,
          expiresIn: expiresIn,
        },
        refreshToken: refreshToken,
      },
    };
  }
}
