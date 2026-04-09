const Client = require('../Client');

describe('Client', () => {
  it('creates a valid client', () => {
    const client = Client.create({ name: 'John Doe', email: 'john@example.com', phone: '555-1234', birthDate: '1990-01-01' });
    expect(client.name).toBe('John Doe');
    expect(client.email).toBe('john@example.com');
    expect(client.isActive).toBe(true);
  });

  it('throws when name is missing', () => {
    expect(() => Client.create({ email: 'john@example.com' })).toThrow('Client name is required');
  });

  it('throws when email is missing', () => {
    expect(() => Client.create({ name: 'John Doe' })).toThrow('Client email is required');
  });
});
