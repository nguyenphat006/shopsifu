import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { ZodSerializerDto } from 'nestjs-zod'
import path from 'path'
import { UploadFilesResDTO, BatchPresignedUploadBodyDTO, BatchPresignedUploadResDTO } from 'src/routes/media/media.dto'
import { MediaService } from 'src/routes/media/media.service'
import { ParseFilePipeWithUnlink } from 'src/routes/media/parse-file-pipe-with-unlink.pipe'
import { UPLOAD_DIR } from 'src/shared/constants/other.constant'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/uploads')
  @ZodSerializerDto(UploadFilesResDTO)
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
      }
    })
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeWithUnlink({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/, skipMagicNumbersValidation: true })
        ]
      })
    )
    files: Array<Express.Multer.File>
  ) {
    return this.mediaService.uploadFile(files)
    // return files.map((file) => ({
    //   url: `${envConfig.PREFIX_STATIC_ENPOINT}/${file.filename}`,
    // }))
  }

  @Get('static/:filename')
  @IsPublic()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      if (error) {
        const notfound = new NotFoundException('File not found')
        res.status(notfound.getStatus()).json(notfound.getResponse())
      }
    })
  }

  @Post('images/upload/presigned-urls')
  @ZodSerializerDto(BatchPresignedUploadResDTO)
  @IsPublic()
  async createBatchPresignedUrls(@Body() body: BatchPresignedUploadBodyDTO) {
    return this.mediaService.getBatchPresignUrls(body.files)
  }
}
