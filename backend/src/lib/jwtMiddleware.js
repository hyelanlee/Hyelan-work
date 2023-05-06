import jwt from 'jsonwebtoken';
import Token from '@lib/token';
import env from '@root/config.json';

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next(); // 토큰이 없음
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    ctx.state.user = {
      userid: decoded.userid,      
    };
    // 토큰 1시간 미만 남으면 재발급
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 1) {
      const token = Token(decoded.userid);
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 10,
        httpOnly: true,
      });
    }

    return next();
  } catch (e) {
    // 토큰 검증 실패
    return next();
  }
};

export default jwtMiddleware;
