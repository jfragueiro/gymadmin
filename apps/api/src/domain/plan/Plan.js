class Plan {
  constructor({ id, name, description, price, durationDays, isActive = true, createdAt, updatedAt }) {
    if (!name) throw new Error('Plan name is required');
    if (price === undefined || price === null) throw new Error('Plan price is required');
    if (!durationDays) throw new Error('Plan durationDays is required');

    this.id = id;
    this.name = name;
    this.description = description || null;
    this.price = price;
    this.durationDays = durationDays;
    this.isActive = isActive;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }

  static create({ id, name, description, price, durationDays }) {
    return new Plan({ id, name, description, price, durationDays });
  }
}

module.exports = Plan;
