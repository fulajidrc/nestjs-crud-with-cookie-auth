import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskGroup, TaskGroupDocument } from 'src/tasks/entities/task-group.entity';
import { Task, TaskDocument } from 'src/tasks/entities/task.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectUser, ProjectUserDocument } from './entities/project-user.entity';
import { Project, ProjectDocument } from './entities/project.entity';
import { SortBulkGroupDto } from './dto/sort-bulk-group.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectUser.name) private projectUserModel: Model<ProjectUserDocument>,
    @InjectModel(TaskGroup.name) private taskGroupModel: Model<TaskGroupDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>
  ){}
  async create(createProjectDto: CreateProjectDto) {
    const project = await this.projectModel.create(createProjectDto);
    await this.projectUserModel.create({
      user: createProjectDto.user,
      owner: true,
      project: project._id
    });
    const defaultTaskGroup:TaskGroup[] = [
      {
        title: 'To Do',
        description: '',
        user: project.user,
        project: project._id,
        index: 0,
      },
      {
        title: 'Progress',
        description: '',
        user: project.user,
        project: project._id,
        index: 1,
      },
      {
        title: 'Done',
        description: '',
        user: project.user,
        project: project._id,
        index: 2,
      }
    ]
    await this.taskGroupModel.create(defaultTaskGroup);
    return project.populate({
      path: 'task_groups',
      populate: {
        path: 'tasks',
        options: { sort: { 'index': 1 } },
        populate: [
          { path: 'assign_users', populate: 'assign_user' }
        ]
      }
    });
  }

  async sortTaskGroup(taskGroups: SortBulkGroupDto[]){
    const bulk = []
    taskGroups.forEach( (task:SortBulkGroupDto) => { 
      let updateDoc = {
        'updateOne': {
          'filter': { '_id': task._id },
          'update': {index: task.index},
          'upsert': true
        }
      }  
      bulk.push(updateDoc)
    })
    this.taskGroupModel.bulkWrite(bulk).then(updateTasks => {
      console.log('task group updated successfully!', updateTasks);
    }).catch(error => {
      console.log('Error in update task ', error);
    })
    return true;
  }

  async findAll(user:string) {
    return await this.projectModel.find({user: user}).populate({
      path: 'task_groups',
      options: { sort: { 'index': 1 } },
      populate: {
        path: 'tasks',
        options: { sort: { 'index': 1 } },
        populate: [ 
          { path: 'assign_users', populate: 'assign_user' }
        ]
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.projectModel.findByIdAndUpdate(id, updateProjectDto, {new: true});
  }

  async remove(id: string) {
    this.projectUserModel.deleteMany({project: id})
    .then(taskGroup => {
      console.log('project user deleted successfully!');
    }).catch(error => {
      console.log('error in delete projectuser',error)
    });
    this.taskGroupModel.deleteMany({project: id})
    .then(taskGroup => {
      console.log('task group deleted successfully!');
    }).catch(error => {
      console.log('error in delete taskgroup',error)
    })
    this.taskModel.deleteMany({project: id})
    .then(taskGroup => {
      console.log('task deleted successfully!');
    }).catch(error => {
      console.log('error in delete task',error)
    })
    return await this.projectModel.findByIdAndRemove(id);
  }
}
