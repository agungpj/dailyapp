import React, { useContext, createContext, useState, useEffect } from 'react'
import { Keyboard } from 'react-native';
const UtilsContext = createContext()

const UtilsProvider = ({children}) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setKeyboardVisible(true); // or some other action
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setKeyboardVisible(false); // or some other action
          }
        );
    
        return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
        };
    
      }, [isKeyboardVisible]);

      const keyboardShown = {
          show: isKeyboardVisible, 
      }

  
    return (
        <UtilsContext.Provider value={keyboardShown}>
            {children}
        </UtilsContext.Provider>
    )
}

export { UtilsContext, UtilsProvider }
