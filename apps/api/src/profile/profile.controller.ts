import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
} from "@nestjs/common";

import { ProfileService }
from "./profile.service";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import {
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor }
from "@nestjs/platform-express";

import { diskStorage }
from "multer";

import { extname }
from "path";

import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(
  JwtAuthGuard
)

@ApiTags("Profile")

@ApiBearerAuth()

@Controller("profile")
export class ProfileController {

  constructor(
    private service:
    ProfileService
  ) {}

  // GET PROFILE
  @Get()
  getProfile(
    @Req() req: any
  ) {

    return this.service.getProfile(
      req.user.userId
    );
  }

  // UPDATE PROFILE
  @Put()
  updateProfile(
    @Req() req: any,
    @Body() body: any
  ) {

    return this.service.updateProfile(
      req.user.userId,
      body
    );
  }

  // CHANGE PASSWORD
  @Put("password")
  changePassword(
    @Req() req: any,
    @Body() body: any
  ) {

    return this.service.changePassword(
      req.user.userId,
      body
    );
  }

  @Post("avatar")
@UseInterceptors(
  FileInterceptor(
    "avatar",
    {
      storage: diskStorage({

        destination:
          "./uploads/avatars",

        filename:
          (
            req,
            file,
            cb
          ) => {

            cb(
              null,
              `${Date.now()}${extname(
                file.originalname
              )}`
            );
          },
      }),
    }
  )
)
uploadAvatar(
  @UploadedFile()
  file: Express.Multer.File,

  @Req()
  req: any
) {

  return this.service.updateProfile(

    req.user.userId,

    {
      avatar:
        `/uploads/avatars/${file.filename}`,
    }
  );
}
}