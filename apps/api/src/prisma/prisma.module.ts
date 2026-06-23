import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 🔥 makes it available everywhere automatically
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 🔥 IMPORTANT
})
export class PrismaModule {}