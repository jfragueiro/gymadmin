const Payment = require('../../domain/payment/Payment');
const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class RegisterPaymentUseCase {
  constructor({ paymentRepository, membershipRepository, clientRepository }) {
    this.paymentRepository = paymentRepository;
    this.membershipRepository = membershipRepository;
    this.clientRepository = clientRepository;
  }

  async execute({ clientId, membershipId, amount, paymentDate, method, reference, notes }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError();

    const membership = await this.membershipRepository.findById(membershipId);
    if (!membership) {
      const err = new Error('Membresía no encontrada');
      err.statusCode = 404;
      throw err;
    }

    const payment = new Payment({
      membershipId,
      clientId,
      amount: parseFloat(amount),
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      method,
      reference,
      notes,
    });

    return this.paymentRepository.save(payment);
  }
}

module.exports = RegisterPaymentUseCase;
