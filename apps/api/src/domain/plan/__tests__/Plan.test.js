const Plan = require('../Plan');

describe('Plan', () => {
  it('creates a valid plan', () => {
    const plan = Plan.create({ name: 'Monthly', price: 29.99, durationDays: 30 });
    expect(plan.name).toBe('Monthly');
    expect(plan.price).toBe(29.99);
    expect(plan.durationDays).toBe(30);
    expect(plan.isActive).toBe(true);
  });

  it('throws when name is missing', () => {
    expect(() => Plan.create({ price: 29.99, durationDays: 30 })).toThrow('Plan name is required');
  });

  it('throws when price is missing', () => {
    expect(() => Plan.create({ name: 'Monthly', durationDays: 30 })).toThrow('Plan price is required');
  });

  it('throws when durationDays is missing', () => {
    expect(() => Plan.create({ name: 'Monthly', price: 29.99 })).toThrow('Plan durationDays is required');
  });
});
