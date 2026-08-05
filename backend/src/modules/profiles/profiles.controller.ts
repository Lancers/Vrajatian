import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../../common/auth/auth.guard';
import { parseWithSchema } from '../../common/validation/parse-with-schema';
import { ProfilesService } from './profiles.service';
import { ProfileResponse, profileUpdateInputSchema } from './profile.dto';

interface AuthedRequest extends Request {
  user?: { id: string; email?: string };
}

/**
 * Any signed-in traveller's own profile — never another user's.
 *   GET   /api/v1/profile
 *   PATCH /api/v1/profile
 */
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get()
  get(@Req() req: AuthedRequest): Promise<ProfileResponse> {
    return this.profiles.getOrCreate(req.user!.id, req.user!.email);
  }

  @Patch()
  update(@Req() req: AuthedRequest, @Body() body: Record<string, unknown>): Promise<ProfileResponse> {
    return this.profiles.update(req.user!.id, parseWithSchema(profileUpdateInputSchema, body));
  }
}
