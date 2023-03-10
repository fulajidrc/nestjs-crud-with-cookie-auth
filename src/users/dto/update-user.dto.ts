import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

// export class UpdateUserDto extends OmitType(CreateUserDto, ['name'] as const) {}

// OmitType

// export class UpdateUserDto extends PartialType(
//     OmitType(CreateUserDto, ['name'] as const),
//   ) {}

export class UpdateUserDto extends PickType(CreateUserDto, ['email'] as const) {}

