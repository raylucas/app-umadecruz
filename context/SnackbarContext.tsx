import { createContext, ReactNode, useContext, useState } from "react";
import { Snackbar } from "react-native-paper";

type SnackbarContextType = {
  showSnackbar: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={{ backgroundColor: "#6200ee" }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
