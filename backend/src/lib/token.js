import jwt from 'jsonwebtoken';
import env from '@root/config.json';

const generateToken = (userid) => {
  const token = jwt.sign(
    // 첫번째 파라미터엔 토큰 안에 집어넣고 싶은 데이터를 넣습니다
    {
      userid: userid,
    },
    env.JWT_SECRET, // 두번째 파라미터에는 JWT 암호를 넣습니다
    {
      expiresIn: '10h', // 10시간
    },
  );
  return token;
};

export default generateToken;