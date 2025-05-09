import Link from "next/link";
import { ActiveLineup } from "@/types/home/active-lineup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function renderStandInfo(millPlan: ActiveLineup) {
  if (
    (millPlan.stand >= 1 && millPlan.stand <= 6) ||
    (millPlan.topWebWidth === 0 && millPlan.bottomWebWidth === 0)
  ) {
    return (
      <p className="text-base text-center">
        Pass Location: {millPlan.passLocation}
      </p>
    );
  }

  if (millPlan.stand >= 7 && millPlan.stand <= 15) {
    return (
      <p className="text-base text-center">
        Web Width: {millPlan.topWebWidth?.toFixed(3)} /{" "}
        {millPlan.bottomWebWidth?.toFixed(3)}
      </p>
    );
  }

  return null;
}

function getChocks(millPlan: ActiveLineup) {
  return [
    {
      id: millPlan.operatorTopChockId,
      name: millPlan.operatorTopChock,
    },
    {
      id: millPlan.operatorBottomChockId,
      name: millPlan.operatorBottomChock,
    },
    {
      id: millPlan.driveTopChockId,
      name: millPlan.driveTopChock,
    },
    {
      id: millPlan.driveBottomChockId,
      name: millPlan.driveBottomChock,
    },
  ].filter((x) => x.name && x.name.trim() !== "");
}

export function MillPlanCard({ millPlan }: { millPlan: ActiveLineup }) {
  const chocks = getChocks(millPlan);

  return (
    <Card className="p-1">
      <CardContent className="space-y-1 p-2">
        <h2 className="text-xl font-medium text-center mb-2">
          Stand {millPlan.stand}
        </h2>
        <p className="text-base text-center">
          Set:{" "}
          <Link
            href={`/equipment/roll-set/turn/${millPlan.setId}`}
            target="_blank"
            className="hover:underline"
          >
            {millPlan.setName}
          </Link>
        </p>

        <p className="text-base text-center">
          Foundry No.:{" "}
          <Link
            href={`/equipment/roll/history/${millPlan.topRollId}`}
            target="_blank"
            className="hover:underline"
          >
            {millPlan.topFoundryNumber}
          </Link>{" "}
          /{" "}
          <Link
            href={`/equipment/roll/history/${millPlan.bottomRollId}`}
            target="_blank"
            className="hover:underline"
          >
            {millPlan.bottomFoundryNumber}
          </Link>
        </p>

        <p className="text-base text-center">
          Diameter: {millPlan.topDiameter} / {millPlan.bottomDiameter}
        </p>

        <div>{renderStandInfo(millPlan)}</div>

        {chocks.length === 0 ? (
          <p className="text-base text-center">Chocks (OT, OB, DT, DB): None</p>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-base text-center">
              Chocks (OT, OB, DT, DB):{" "}
              {chocks.map((chock, index) => (
                <span key={chock.id || index}>
                  {index > 0 && " / "}
                  <Link
                    href={`/equipment/chock/history/${chock.id}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {chock.name}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
