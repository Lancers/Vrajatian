import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminGuard } from './admin.guard';

interface AuthedRequest extends Request {
  user?: { id: string; email?: string };
}

/**
 * Lets the frontend ask "is the signed-in user an admin?" before it renders the
 * admin UI. The guard does all the work — reaching the handler at all means yes,
 * so a 401/403 is the answer for everyone else.
 *   GET /api/v1/admin/me
 */
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminSessionController {
  @Get('me')
  me(@Req() req: AuthedRequest) {
    return req.user;
  }
}
