import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { createResponse, getUserResponse, listUserResponse } from './res';
import { bedResponse, ForbiddenResponse, serverErrorResponse, UnauthorizedResponse } from 'src/response_type';
import { updateUserResponse } from './res/updateUserResponse';
const saltOrRounds = 10;


@ApiTags('users')
@Controller('users')
@ApiBearerAuth('Bearer')	
@ApiResponse(bedResponse)
@ApiResponse(ForbiddenResponse)
@ApiResponse(UnauthorizedResponse)
@ApiResponse(serverErrorResponse)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse(createResponse)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res){

    const checkUser = await this.usersService.findOneByEmail(createUserDto.email);
    if(checkUser){
      return res.status(HttpStatus.BAD_REQUEST).send({message: 'Email already exits!'});
    }
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    createUserDto = {...createUserDto, password: hash}
    const data = await this.usersService.create(createUserDto);
    res.status(HttpStatus.CREATED).send({message: 'User added successfully!', data: data});
  }

  @ApiResponse(listUserResponse)
  @Get()
  async findAll(@Res() res) {
    const users = await this.usersService.findAll();
    res.status(HttpStatus.OK).send({message: 'User\'s list', data: users});
  }

  @ApiResponse(getUserResponse)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const user = await this.usersService.findOne(id);
    return user 
    ? res.status(HttpStatus.OK).send({message: 'User\'s detail', data: user})
    : res.status(HttpStatus.BAD_REQUEST).send({message: 'User not found!', data: user});
  }

  @ApiBody({ type: CreateUserDto })
  @ApiResponse(updateUserResponse)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    const user = await this.usersService.update(id, updateUserDto);
    return res.status(HttpStatus.OK).send({message: 'User updated successfully!', data: user});
  }


  @ApiResponse({...getUserResponse, description: 'Delete user'})
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const user = await this.usersService.remove(id);
    return user 
    ? res.status(HttpStatus.OK).send({message: 'User deleted successfully!', data: user}) 
    : res.status(HttpStatus.BAD_REQUEST).send({message: 'User not deleted!', data: user})
  }

}
