import {
  Processor,
  Process,
  OnQueueCompleted,
  OnGlobalQueueCompleted,
  InjectQueue,
  OnGlobalQueueWaiting,
  OnGlobalQueueError,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { UsersService } from '../users/users.service';

@Processor('auth')
export class AuthConsumer {
  constructor(
    @InjectQueue('auth') private immediateQueue: Queue,
    private readonly usersService: UsersService,
  ) {}

  @Process('register')
  async register(job: Job<unknown>) {
    await this.usersService.createUser(job.data);

    return {};
  }
  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, result: any) {
    const job = await this.immediateQueue.getJob(jobId);
    console.log('(Global) on completed: job ', job.id, ' -> result: ', result);
  }

  @OnGlobalQueueError()
  async OnGlobalError(error: Error) {
    console.log(error);
  }
}
