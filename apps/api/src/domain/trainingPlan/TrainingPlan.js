class TrainingPlan {
  constructor({ id, clientId, name, goal, notes, isActive, createdAt, updatedAt, exercises }) {
    this.id = id;
    this.clientId = clientId;
    this.name = name;
    this.goal = goal || null;
    this.notes = notes || null;
    this.isActive = isActive ?? true;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.exercises = exercises || [];
  }

  static create({ clientId, name, goal, notes }) {
    if (!clientId) throw new Error('clientId is required');
    if (!name || name.trim().length === 0) throw new Error('name is required');
    return new TrainingPlan({ clientId, name: name.trim(), goal, notes });
  }
}

module.exports = TrainingPlan;
