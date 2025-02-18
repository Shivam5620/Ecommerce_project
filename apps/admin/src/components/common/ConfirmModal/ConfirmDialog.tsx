import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import Alert, { ConfirmAlertProps } from "./Alert";

const defaultProps: ConfirmAlertProps = {
  show: false,
  title: "Confirm",
  description: "",
  confirmButtonLabel: "Yes",
  cancelButtonLabel: "No",
  onConfirm: () => {},
  onClose: () => {},
};

const ConfirmDialog = createContext<
  (data: Partial<Omit<ConfirmAlertProps, "show">>) => Promise<boolean>
>(async () => false);

export const ConfirmModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<ConfirmAlertProps>(defaultProps);

  const fn = useRef<any>(null);

  const confirm: (
    data: Partial<Omit<ConfirmAlertProps, "show">>,
  ) => Promise<boolean> = useCallback(
    (data) =>
      new Promise((resolve) => {
        setState({ ...state, ...data, show: true });
        fn.current = (choice: boolean) => {
          resolve(choice);
          setState({ ...state, ...data, show: false });
        };
      }),
    [state],
  );

  return (
    <ConfirmDialog.Provider value={confirm}>
      {children}
      <Alert
        {...state}
        show={state.show}
        onClose={() => fn.current(false)}
        onConfirm={() => fn.current(true)}
      />
    </ConfirmDialog.Provider>
  );
};

export default function useConfirm() {
  return useContext(ConfirmDialog);
}
