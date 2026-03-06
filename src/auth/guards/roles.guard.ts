import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator'; // 👈 Pastikan path ini benar sesuai folder kamu

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Tambahkan pengecekan ini supaya tidak error "cannot read property role of undefined"
    if (!user || !user.role) {
      throw new ForbiddenException('User tidak memiliki role atau belum login');
    }

    const hasRole = roles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException('Hanya Admin yang boleh melakukan aksi ini');
    }

    return hasRole;
  }
}