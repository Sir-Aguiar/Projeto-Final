const { Router } = require("express");
const { storage } = require("../server/utils/multer-config");
const routes = Router();
const RegisterUser = require("./controllers/User/ReigsterUser");
const Login = require("./controllers/User/Login");
const UserAuthMiddleware = require("./middlewares/UserAuth");
const GetSchoolsController = require("./controllers/Escolas/Get");
const UpdateSchoolController = require("./controllers/Escolas/Update");
const UpdateClassController = require("./controllers/Turmas/Update");
const DeleteSchoolController = require("./controllers/Escolas/Delete");
const CreateClassController = require("./controllers/Turmas/Create");
const GetClassController = require("./controllers/Turmas/Get");
const DeleteTurmasController = require("./controllers/Turmas/Delete");
const CreateAlunosController = require("./controllers/Alunos/Create");
const GetAlunosController = require("./controllers/Alunos/Get");
const UpdateAlunosController = require("./controllers/Alunos/Update");
const DeleteAlunosController = require("./controllers/Alunos/Delete");
const CreateDisciplinaController = require("./controllers/Disciplinas/Create");
const CreateDisciplineGridController = require("./controllers/CursoDisciplina/Create");
const GetDisciplinasController = require("./controllers/Disciplinas/Get");
const UpdateDisciplinasController = require("./controllers/Disciplinas/Update");
const DeleteDisciplinasController = require("./controllers/Disciplinas/Delete");
const GetCursoDisciplinaController = require("./controllers/CursoDisciplina/Get");
const DeleteCursoDisciplinasController = require("./controllers/CursoDisciplina/Delete");
const UpdateCursoDisciplinaController = require("./controllers/CursoDisciplina/Update");
const CreateProfessorController = require("./controllers/Professor/Create");
const GetProfessorLecionaController = require("./controllers/Professor/Get");
const DeleteProfessorLecionaController = require("./controllers/Professor/Delete");
const UpdateProfessorLecionaController = require("./controllers/Professor/Update");
const CreateAulaController = require("./controllers/Aulas/Create");
const GetAulasController = require("./controllers/Aulas/Get");
const UdpateAulasController = require("./controllers/Aulas/Update");
const DeleteAulasController = require("./controllers/Aulas/Delete");
const CreateChamadaController = require("./controllers/Chamada/Create");
const GetChamadaController = require("./controllers/Chamada/Get");
const DeleteChamadaController = require("./controllers/Chamada/Delete");
const UpdateChamadaController = require("./controllers/Chamada/Update");
const CreateAlunoChamadaController = require("./controllers/AlunoChamada/Create");
const GetAlunoChamadaController = require("./controllers/AlunoChamada/Get");
const UpdateAlunoChamadaController = require("./controllers/AlunoChamada/Update");
const DeleteAlunoChamadaController = require("./controllers/AlunoChamada/Delete");
const GetProfessorsStatsByClassRooms = require("./controllers/Stats/aulas-professor-turma");
const MonthlyPresenceController = require("./controllers/Stats/StudentMontlyPresnce");
const GetTurmaStatsController = require("./controllers/Stats/turma-stats");
const GetUserController = require("./controllers/User/Get");
const DeleteUserController = require("./controllers/User/Delete");
const UpdateUserController = require("./controllers/User/Update");
const CreateSchoolController = require("./controllers/Escolas/Create");
const multer = require("multer");
const UpdateProfileImageController = require("./controllers/User/UpdateImage");
const CheckPasswordController = require("./controllers/User/CheckPassword");

routes.post("/registro", RegisterUser);
routes.post("/login", Login);

routes.post("/escola", UserAuthMiddleware, CreateSchoolController);
routes.get("/escola", UserAuthMiddleware, GetSchoolsController);
routes.put("/escola", UserAuthMiddleware, UpdateSchoolController);
routes.delete("/escola", UserAuthMiddleware, DeleteSchoolController);

routes.get("/turma", UserAuthMiddleware, GetClassController);
routes.post("/turma", UserAuthMiddleware, CreateClassController);
routes.put("/turma", UserAuthMiddleware, UpdateClassController);
routes.delete("/turma", UserAuthMiddleware, DeleteTurmasController);

routes.post("/disciplina", UserAuthMiddleware, CreateDisciplinaController);
routes.get("/disciplina", UserAuthMiddleware, GetDisciplinasController);
routes.put("/disciplina/:idDisciplina", UserAuthMiddleware, UpdateDisciplinasController);
routes.delete("/disciplina/:idDisciplina", UserAuthMiddleware, DeleteDisciplinasController);

routes.post("/curso-disciplina", UserAuthMiddleware, CreateDisciplineGridController);
routes.get("/grade", UserAuthMiddleware, GetCursoDisciplinaController);
routes.delete("/curso-disciplina/:idCurso/:idDisciplina", UserAuthMiddleware, DeleteCursoDisciplinasController);
routes.put("/curso-disciplina/:idCurso/:idDisciplina", UserAuthMiddleware, UpdateCursoDisciplinaController);

routes.post("/professor-leciona", UserAuthMiddleware, CreateProfessorController);
routes.get("/professor", UserAuthMiddleware, GetProfessorLecionaController);
routes.get("/professor-leciona/:idTurma", UserAuthMiddleware, GetProfessorLecionaController);

routes.delete(
  "/professor-leciona/:idProfessor/:idTurma/:idDisciplina",
  UserAuthMiddleware,
  DeleteProfessorLecionaController,
);

routes.put(
  "/professor-leciona/:idProfessor/:idTurma/:idDisciplina",
  UserAuthMiddleware,
  UpdateProfessorLecionaController,
);

routes.post("/aula", UserAuthMiddleware, CreateAulaController);
routes.get("/aula", UserAuthMiddleware, GetAulasController);
routes.put("/aula/:idAula", UserAuthMiddleware, UdpateAulasController);
routes.delete("/aula/:idAula", UserAuthMiddleware, DeleteAulasController);

routes.post("/aluno", UserAuthMiddleware, CreateAlunosController);
routes.get("/aluno", UserAuthMiddleware, GetAlunosController);
routes.delete("/aluno", UserAuthMiddleware, DeleteAlunosController);
routes.put("/aluno", UserAuthMiddleware, UpdateAlunosController);

routes.post("/chamada", UserAuthMiddleware, CreateChamadaController);
routes.get("/chamada/:idAula", UserAuthMiddleware, GetChamadaController);
routes.delete("/chamada/:idChamada", UserAuthMiddleware, DeleteChamadaController);
routes.put("/chamada/:idChamada", UserAuthMiddleware, UpdateChamadaController);

routes.post("/aluno-chamada", UserAuthMiddleware, CreateAlunoChamadaController);
routes.get("/aluno-chamada/:idChamada", UserAuthMiddleware, GetAlunoChamadaController);
routes.delete("/aluno-chamada/:idAluno/:idChamada", UserAuthMiddleware, DeleteAlunoChamadaController);
routes.put("/aluno-chamada/:idAluno/:idChamada", UserAuthMiddleware, UpdateAlunoChamadaController);

routes.get("/usuario", UserAuthMiddleware, GetUserController);
routes.delete("/usuario", UserAuthMiddleware, DeleteUserController);
routes.put("/usuario", UserAuthMiddleware, UpdateUserController);
routes.get("/aulas-professor-turma", UserAuthMiddleware, GetProfessorsStatsByClassRooms);
routes.get("/students-stat", UserAuthMiddleware, MonthlyPresenceController);
routes.get("/class-stats", UserAuthMiddleware, GetTurmaStatsController);

routes.post("/check-password", UserAuthMiddleware, CheckPasswordController)


const upload = multer({ storage });
routes.post("/profile-image", UserAuthMiddleware, upload.single("profile_image"), UpdateProfileImageController);

module.exports = routes;
