interface IUsuario {
  idUsuario: number;
  nome: string;
  email: string;
  profile_image: string;
}

interface ToUpdateUser {
  nome?: string;
  email?: string;
  senha?: string;
}

export type { IUsuario, ToUpdateUser };
