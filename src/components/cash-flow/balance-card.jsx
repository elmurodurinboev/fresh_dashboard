import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx"
import {Formatter} from "@/utils/formatter.js";

const BalanceCard = ({title, description, amount}) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardDescription className="text-black text-xl font-medium">{title}</CardDescription>
        {description && (
          <CardDescription className="text-xs text-gray-400">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl font-bold text-primary">
          {amount && Formatter.currency(Number(amount))} {' '} UZS
        </CardTitle>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;