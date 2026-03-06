import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Put, 
  Delete, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // 👈 Sesuaikan path-nya

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // --- FITUR PROFILE (Hanya untuk diri sendiri) ---

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    // req.user berisi data yang kita return dari JwtStrategy.validate()
    return {
      message: 'Data profil berhasil diambil',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-me')
  updateMe(@Req() req, @Body() updateData: any) {
    const userId = req.user.userId; // Ambil ID dari token JWT
    return this.auth.updateUser(userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-me')
  deleteMe(@Req() req) {
    const userId = req.user.userId; // Ambil ID dari token JWT
    return this.auth.deleteUser(userId);
  }
}