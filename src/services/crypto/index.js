import crypto from 'crypto';

export const encrypt = password => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      process.env.PW_SALT,
      81739,
      64,
      'sha512',
      async (err, key) => resolve(key.toString('base64'))
    );
  });
};
