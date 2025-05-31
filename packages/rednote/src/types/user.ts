type UserMe =
  | {
      guest: true;
      user_id: string;
    }
  | {
      guest: false;
      red_id: string;
      user_id: string;
      nickname: string;
      desc: string;
      gender: number; // enum
      images: string;
      imageb: string;
    };

export type { UserMe };
