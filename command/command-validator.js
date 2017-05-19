module.exports.isValid = (commandRequest) => {
  const command = commandRequest.command;
  const params = commandRequest.text.split(' ');

  // Verify that the parameters are valid for the given command

  console.log(`Command: ${command}, Params: ${params}`);

  return true;
};