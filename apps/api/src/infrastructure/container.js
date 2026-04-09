const PostgresClientRepository = require('./repositories/PostgresClientRepository');
const PostgresPlanRepository = require('./repositories/PostgresPlanRepository');
const PostgresMembershipRepository = require('./repositories/PostgresMembershipRepository');
const PostgresUserRepository = require('./repositories/PostgresUserRepository');
const PostgresAttendanceRepository = require('./repositories/PostgresAttendanceRepository');
const PostgresPaymentRepository = require('./repositories/PostgresPaymentRepository');
const JwtTokenService = require('./services/JwtTokenService');
const BcryptPasswordHasher = require('./services/BcryptPasswordHasher');
const QRCodeGenerator = require('./services/QRCodeGenerator');

const RegisterClientUseCase = require('../application/client/RegisterClientUseCase');
const GetClientUseCase = require('../application/client/GetClientUseCase');
const ListClientsUseCase = require('../application/client/ListClientsUseCase');
const UpdateClientUseCase = require('../application/client/UpdateClientUseCase');
const SoftDeleteClientUseCase = require('../application/client/SoftDeleteClientUseCase');

const CreatePlanUseCase = require('../application/plan/CreatePlanUseCase');
const GetPlanUseCase = require('../application/plan/GetPlanUseCase');
const ListPlansUseCase = require('../application/plan/ListPlansUseCase');
const UpdatePlanUseCase = require('../application/plan/UpdatePlanUseCase');
const SoftDeletePlanUseCase = require('../application/plan/SoftDeletePlanUseCase');

const AssignPlanUseCase = require('../application/membership/AssignPlanUseCase');
const GetClientMembershipsUseCase = require('../application/membership/GetClientMembershipsUseCase');
const GetClientsWithMembershipUseCase = require('../application/membership/GetClientsWithMembershipUseCase');

const PostgresTrainingPlanRepository = require('./repositories/PostgresTrainingPlanRepository');
const CreateTrainingPlanUseCase = require('../application/trainingPlan/CreateTrainingPlanUseCase');
const GetClientTrainingPlansUseCase = require('../application/trainingPlan/GetClientTrainingPlansUseCase');
const UpdateTrainingPlanUseCase = require('../application/trainingPlan/UpdateTrainingPlanUseCase');
const DeleteTrainingPlanUseCase = require('../application/trainingPlan/DeleteTrainingPlanUseCase');
const AddExerciseUseCase = require('../application/trainingPlan/AddExerciseUseCase');
const RemoveExerciseUseCase = require('../application/trainingPlan/RemoveExerciseUseCase');

const RegisterPaymentUseCase = require('../application/payment/RegisterPaymentUseCase');
const GetClientPaymentsUseCase = require('../application/payment/GetClientPaymentsUseCase');

const CheckInUseCase = require('../application/attendance/CheckInUseCase');
const GetDailyAttendanceUseCase = require('../application/attendance/GetDailyAttendanceUseCase');
const GetClientAttendanceUseCase = require('../application/attendance/GetClientAttendanceUseCase');
const QRCheckInUseCase = require('../application/attendance/QRCheckInUseCase');
const GetClientQRUseCase = require('../application/attendance/GetClientQRUseCase');
const RegenerateQRTokenUseCase = require('../application/attendance/RegenerateQRTokenUseCase');

const LoginUseCase = require('../application/auth/LoginUseCase');
const RegisterUserUseCase = require('../application/auth/RegisterUserUseCase');

const clientRepository = new PostgresClientRepository();
const planRepository = new PostgresPlanRepository();
const membershipRepository = new PostgresMembershipRepository();
const userRepository = new PostgresUserRepository();
const attendanceRepository = new PostgresAttendanceRepository();
const paymentRepository = new PostgresPaymentRepository();
const trainingPlanRepository = new PostgresTrainingPlanRepository();
const tokenService = new JwtTokenService();
const passwordHasher = new BcryptPasswordHasher();
const qrCodeGenerator = new QRCodeGenerator();

const registerClientUseCase = new RegisterClientUseCase({ clientRepository });
const getClientUseCase = new GetClientUseCase({ clientRepository });
const listClientsUseCase = new ListClientsUseCase({ clientRepository });
const updateClientUseCase = new UpdateClientUseCase({ clientRepository });
const softDeleteClientUseCase = new SoftDeleteClientUseCase({ clientRepository });

const createPlanUseCase = new CreatePlanUseCase({ planRepository });
const getPlanUseCase = new GetPlanUseCase({ planRepository });
const listPlansUseCase = new ListPlansUseCase({ planRepository });
const updatePlanUseCase = new UpdatePlanUseCase({ planRepository });
const softDeletePlanUseCase = new SoftDeletePlanUseCase({ planRepository });

const assignPlanUseCase = new AssignPlanUseCase({ membershipRepository, clientRepository, planRepository });
const getClientMembershipsUseCase = new GetClientMembershipsUseCase({ membershipRepository, clientRepository });
const getClientsWithMembershipUseCase = new GetClientsWithMembershipUseCase({ membershipRepository });

const registerPaymentUseCase = new RegisterPaymentUseCase({ paymentRepository, membershipRepository, clientRepository });
const getClientPaymentsUseCase = new GetClientPaymentsUseCase({ paymentRepository, clientRepository });

const checkInUseCase = new CheckInUseCase({ attendanceRepository, clientRepository });
const getDailyAttendanceUseCase = new GetDailyAttendanceUseCase({ attendanceRepository });
const getClientAttendanceUseCase = new GetClientAttendanceUseCase({ attendanceRepository, clientRepository });
const qrCheckInUseCase = new QRCheckInUseCase({ clientRepository, membershipRepository, attendanceRepository });
const getClientQRUseCase = new GetClientQRUseCase({ clientRepository, qrCodeGenerator });
const regenerateQRTokenUseCase = new RegenerateQRTokenUseCase({ clientRepository });

const createTrainingPlanUseCase = new CreateTrainingPlanUseCase({ trainingPlanRepository, clientRepository });
const getClientTrainingPlansUseCase = new GetClientTrainingPlansUseCase({ trainingPlanRepository });
const updateTrainingPlanUseCase = new UpdateTrainingPlanUseCase({ trainingPlanRepository });
const deleteTrainingPlanUseCase = new DeleteTrainingPlanUseCase({ trainingPlanRepository });
const addExerciseUseCase = new AddExerciseUseCase({ trainingPlanRepository });
const removeExerciseUseCase = new RemoveExerciseUseCase({ trainingPlanRepository });

const loginUseCase = new LoginUseCase({ userRepository, passwordHasher, tokenService });
const registerUserUseCase = new RegisterUserUseCase({ userRepository, passwordHasher });

module.exports = {
  registerClientUseCase,
  getClientUseCase,
  listClientsUseCase,
  updateClientUseCase,
  softDeleteClientUseCase,
  createPlanUseCase,
  getPlanUseCase,
  listPlansUseCase,
  updatePlanUseCase,
  softDeletePlanUseCase,
  assignPlanUseCase,
  getClientMembershipsUseCase,
  getClientsWithMembershipUseCase,
  registerPaymentUseCase,
  getClientPaymentsUseCase,
  checkInUseCase,
  getDailyAttendanceUseCase,
  getClientAttendanceUseCase,
  qrCheckInUseCase,
  getClientQRUseCase,
  regenerateQRTokenUseCase,
  createTrainingPlanUseCase,
  getClientTrainingPlansUseCase,
  updateTrainingPlanUseCase,
  deleteTrainingPlanUseCase,
  addExerciseUseCase,
  removeExerciseUseCase,
  loginUseCase,
  registerUserUseCase,
  tokenService,
};
