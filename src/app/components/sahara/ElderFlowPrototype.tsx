import SmsAlertFlow from "../../flows-prototypes/sahara-sms-alert-flow";
import IrrecoverableErrorFlow from "../../flows-prototypes/sahara-flow-irrcoverable-error";
import WalkthroughFlow from "../../flows-prototypes/sahara-walkthrough-flow";
import WifiFixWalkthroughFlow from "../../flows-prototypes/sahara-wifi-fix-walkthrough-flow";

export type FlowPrototypeKey =
  | "sms-alert-flow"
  | "irreversible-action-flow"
  | "walkthrough-flow"
  | "wifi-fix-flow";

type ElderFlowPrototypeProps = {
  activeFlow: FlowPrototypeKey;
};

export default function ElderFlowPrototype({
  activeFlow,
}: ElderFlowPrototypeProps) {
  if (activeFlow === "sms-alert-flow") {
    return <SmsAlertFlow />;
  }

  if (activeFlow === "irreversible-action-flow") {
    return <IrrecoverableErrorFlow />;
  }

  if (activeFlow === "walkthrough-flow") {
    return <WalkthroughFlow />;
  }

  return <WifiFixWalkthroughFlow />;
}
