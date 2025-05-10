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
  //   const seconds = faker.number
  //     .int({ min: 0, max: 59 })
  //     .toString()
  //     .padStart(2, '0');
  return `${hours}:${minutes}`;
};

export async function seedEvents() {
  try {
    console.log('⏳ Seeding events with custom colors and categories...');

    await db.delete(events);

    const fakeEvents = Array.from({ length: 50 }, () => {
      const startDate = faker.date.soon({ days: 30 });
      const endDate = new Date(startDate);
      endDate.setHours(
        startDate.getHours() + faker.number.int({ min: 1, max: 4 }),
      );

      const category = faker.helpers.arrayElement(CATEGORY_OPTIONS);
      const color = faker.helpers.arrayElement(EVENT_COLORS);
      const isRepeating = faker.datatype.boolean({ probability: 0.3 });

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

    await db.insert(events).values(fakeEvents);

    console.log('✅ Seeding completed with custom colors/categories!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedEvents();
