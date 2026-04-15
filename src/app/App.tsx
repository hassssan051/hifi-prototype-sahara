import { useState } from "react";
import DemoLayout, {
  type DemoTypeKey,
  type DeviceKey,
} from "./components/presenter/DemoLayout";
import type { FlowPrototypeKey } from "./components/sahara/ElderFlowPrototype";

export default function App() {
  const [activeDemoType, setActiveDemoType] = useState<DemoTypeKey>("app");
  const [activeDevice, setActiveDevice] = useState<DeviceKey>("elder");
  const [activeFlowPrototype, setActiveFlowPrototype] =
    useState<FlowPrototypeKey>("sms-alert-flow");
  const [resetKey, setResetKey] = useState(0);

  const handleResetSimulation = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <DemoLayout
      key={resetKey}
      activeDemoType={activeDemoType}
      activeDevice={activeDevice}
      activeFlowPrototype={activeFlowPrototype}
      onDemoTypeChange={setActiveDemoType}
      onDeviceChange={setActiveDevice}
      onFlowPrototypeChange={setActiveFlowPrototype}
      onResetPresenter={handleResetSimulation}
    />
  );
}
