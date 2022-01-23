import crypto from 'crypto'

const generateSalt = (rounds: number = 12): string => {
  return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds);
}

const hashPassword = (password: string, salt: string): string => {
  const hash = crypto.createHmac('sha512', salt);
  
  hash.update(password);

  return hash.digest('hex');
}

const comparePassword = (password: string, hashedPassword: string, salt: string): boolean => {
  if (password && hashedPassword && salt) return hashedPassword === hashPassword(password, salt);
  return false;
}

export { generateSalt, hashPassword, comparePassword }