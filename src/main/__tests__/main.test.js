const { default: prismaClient } = require('../database/prismaContext');

describe('Database operations tests', () => {
  let createdEnvironment = null;
  it('Should create an environment with an update schedule and auth keys', async () => {
    createdEnvironment = await prismaClient.environment.create({
      data: {
        baseUrl: 'http://localhost:8080',
        kind: 'PROD',
        name: 'Jest Test',
        release: '1.8',
        updateSchedule: {
          create: {
            from: '07:00:00',
            to: '17:30:00',
            frequency: '6h',
            onlyOnWorkDays: true,
          },
        },
        oAuthKeys: 'YXBlbmFzIHVtIHRlc3Rl',
      },
    });

    expect(createdEnvironment).toBe(!null);
  });
});
