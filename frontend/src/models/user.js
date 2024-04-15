let userState = {
    isLoggedIn: false,
    mechanic: null
  };
  
  export const getUser = () => {
    return userState;
  };
  
  export const setUser = (mechanicDetails) => {
    userState = {
      isLoggedIn: true,
      mechanic: {
        id: mechanicDetails.id,
        employeeNumber: mechanicDetails.employeeNumber,
        nome: mechanicDetails.nome,
        especialidade: mechanicDetails.especialidade
      }
    };
  };

  export const logout = () => {
    userState = {
      isLoggedIn: false,
      mechanic: null
    };
  }
  