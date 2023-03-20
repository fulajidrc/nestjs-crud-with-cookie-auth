import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAssignTaskDto } from './dto/create-assign-task.dto';
import { UpdateAssignTaskDto } from './dto/update-assign-task.dto';
import { AssignTask, AssignTaskDocument } from './entities/assign-task.entity';

@Injectable()
export class AssignTasksService {
  constructor(
    @InjectModel(AssignTask.name) private assignTaskModel: Model<AssignTaskDocument>
  ){}
  create(createAssignTaskDto: CreateAssignTaskDto) {
    return this.assignTaskModel.create(createAssignTaskDto);
  }

  findAll() {
    return `This action returns all assignTasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignTask`;
  }

  update(id: number, updateAssignTaskDto: UpdateAssignTaskDto) {
    return `This action updates a #${id} assignTask`;
  }

  remove(id: string) {
    return this.assignTaskModel.findByIdAndRemove(id);
  }
}
