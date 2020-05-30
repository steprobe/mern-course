function failAuth(response) {
  return response.status(401).json({
    msg: 'ah ah ah, you didnt say the magic word. Signed, Newman'
  });
}

module.exports = failAuth;
