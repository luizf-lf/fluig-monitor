import log from 'electron-log';
import { UpdateSchedule } from '../generated/client';
import prismaClient from '../database/prismaContext';
import { UpdateScheduleControllerInterface } from '../../common/interfaces/UpdateScheduleControllerInterface';

export default class UpdateScheduleController {
  created: UpdateSchedule | null;

  updated: UpdateSchedule | null;

  constructor() {
    this.created = null;
    this.updated = null;
  }

  async new(data: UpdateScheduleControllerInterface): Promise<UpdateSchedule> {
    log.info(
      'UpdateScheduleController: Creating a new environment update schedule.'
    );
    this.created = await prismaClient.updateSchedule.create({
      data,
    });

    return this.created;
  }

  async update(
    data: UpdateScheduleControllerInterface
  ): Promise<UpdateSchedule> {
    log.info(
      'UpdateScheduleController: Updating an environment update schedule.'
    );

    this.updated = await prismaClient.updateSchedule.update({
      where: {
        environmentId: data.environmentId,
      },
      data,
    });

    return this.updated;
  }
}
