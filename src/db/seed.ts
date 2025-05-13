import { CATEGORY_OPTIONS, EVENT_COLORS } from '@/constants/event-options';
import { db } from './index';
import { events } from './schema';
import { faker } from '@faker-js/faker';

const generateRandomTime = () => {
  const hours = faker.number
    .int({ min: 0, max: 23 })
    .toString()
    .padStart(2, '0');
  const minutes = faker.number
    .int({ min: 0, max: 59 })
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getBalancedCategory = () => {
  const index = faker.number.int({ min: 0, max: CATEGORY_OPTIONS.length - 1 });
  return CATEGORY_OPTIONS[index];
};

export async function seedEvents() {
  try {
    console.log('⏳ Seeding events across 12 months...');

    await db.delete(events);

    const MONTH_RANGE = 6;
    const TODAY = new Date();
    const EVENT_COUNT = 500;

    const fakeEvents = Array.from({ length: EVENT_COUNT }, (_, i) => {
      const randomMonth = faker.number.int({
        min: -MONTH_RANGE,
        max: MONTH_RANGE,
      });

      const startDate = new Date(
        TODAY.getFullYear(),
        TODAY.getMonth() + randomMonth,
        faker.number.int({ min: 1, max: 28 }),
        faker.number.int({ min: 0, max: 23 }),
        faker.number.int({ min: 0, max: 59 }),
      );

      const endDate = new Date(startDate);
      endDate.setHours(
        startDate.getHours() + faker.number.int({ min: 1, max: 4 }),
      );

      const category = getBalancedCategory();
      const color = faker.helpers.arrayElement(EVENT_COLORS);
      const isRepeating = i < 20; // 5% event berulang

      return {
        title: `${category.label}: ${faker.lorem.words(3)}`,
        description: faker.lorem.sentences(2),
        startDate,
        endDate,
        startTime: generateRandomTime(),
        endTime: generateRandomTime(),
        isRepeating,
        repeatingType: isRepeating
          ? faker.helpers.arrayElement(['daily', 'weekly', 'monthly'])
          : null,
        location: `${faker.location.streetAddress()}, ${faker.location.city()}`,
        category: category.value,
        color: color.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    const monthDistribution = fakeEvents.reduce<Record<number, number>>(
      (acc, event) => {
        const month = event.startDate.getMonth();
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {},
    );

    console.log('📅 Event Distribution by Month:', monthDistribution);

    await db.transaction(async (tx) => {
      await tx.insert(events).values(fakeEvents);
    });

    console.log(
      `✅ Successfully seeded ${EVENT_COUNT} events across 12 months!`,
    );
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedEvents();
