export type Ticket = {
    id: string;
    title: string;
    description: string;
    price: string;
    category: '전체' | '제휴 할인' | '이달의 할인' | '매직패스';
    image: any; 
  };
  
  export const TICKET_DATA: Ticket[] = [
    {
      id: '1',
      title: '롯데월드카드 전용',
      description: '본인 + 동반 1인 50%',
      price: '₩26,000 ~',
      category: '제휴 할인',
      image: require('@/assets/images/ticketsmall01.png'),
    },
    {
      id: '2',
      title: '삼성카드 전 회원 프로모션',
      description: '본인 + 동반 1인 45%',
      price: '₩28,600 ~',
      category: '제휴 할인',
      image: require('@/assets/images/ticketsmall05.png'),
    },
    {
      id: '3',
      title: '포켓몬 패키지',
      description: '포켓몬 코스프레 PKG',
      price: '₩45,000 ~',
      category: '이달의 할인',
      image: require('@/assets/images/ticketsmall02.png'),
    },
    {
      id: '5',
      title: '1일권(7월)',
      description: '제휴카드 50%',
      price: '₩31,000 ~',
      category: '제휴 할인',
      image: require('@/assets/images/ticketsmall03.png'),
    },
    {
      id: '6',
      title: 'AFTER4(16시이후)_(7월)',
      description: '제휴카드 50%',
      price: '₩25,000 ~',
      category: '제휴 할인',
      image: require('@/assets/images/ticketsmall03.png'),
    },
    {
      id: '7',
      title: '카카오페이와 함께하는 여름이었다',
      description: '카카오페이(1 DAY)',
      price: '₩36,500 ~',
      category: '이달의 할인',
      image: require('@/assets/images/ticketsmall04.png'),
    },
    {
      id: '8',
      title: '쿠팡와우카드와 함께 혜택이 팡팡',
      description: '쿠팡 와우카드 전용',
      price: '₩32,750 ~',
      category: '제휴 할인',
      image: require('@/assets/images/ticketsmall03.png'),
    },
    {
      id: '9',
      title: '매직패스프리미엄 5회권',
      description: '매직패스프리미엄 5회',
      price: '₩54,000 ~',
      category: '매직패스',
      image: require('@/assets/images/ticketsmall03.png'),
    },
    {
      id: '10',
      title: '매직패스프리미엄 7회권',
      description: '매직패스프리미엄 7회',
      price: '₩75,000 ~',
      category: '매직패스',
      image: require('@/assets/images/ticketsmall03.png'),
    },
  ];