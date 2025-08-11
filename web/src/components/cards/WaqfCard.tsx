import { WaqfCardsProps } from '@/interfaces'
import { Text, Card, UnstyledButton, Box } from '@mantine/core'
import { useStyles } from './WaqfCard.styles'

const WaqfCard = ({
  waqf,
  selectedWaqfType,
  setSelectedWaqfType,
}: WaqfCardsProps): JSX.Element => {
  const { classes } = useStyles()
  const isSelected = waqf.waqfType === selectedWaqfType

  const handleWaqfCardClick = () => {
    setSelectedWaqfType(waqf.waqfType)
  }

  return (
    <Card
      className={`${classes.card} ${isSelected ? classes.selectedCard : ''}`}
    >
      <UnstyledButton
        variant="filled"
        className={classes.unstyledButton}
        onClick={handleWaqfCardClick}
      >
        <Box>
          <img src={waqf.svg} alt={waqf.name} />
          <Text className={classes.title}>{waqf.name}</Text>
        </Box>
      </UnstyledButton>
    </Card>
  )
}

export default WaqfCard
