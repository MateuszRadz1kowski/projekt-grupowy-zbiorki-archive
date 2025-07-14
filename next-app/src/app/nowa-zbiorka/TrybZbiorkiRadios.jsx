import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group'

export default function TrybZbiorkiRadios({ nowaZbiorkaInput, handleTrybChange }) {
  return (
    <div>
      <Label className='text-sm font-medium'>Tryb Zbiórki</Label>
      <RadioGroup defaultValue={nowaZbiorkaInput.tryb} onValueChange={handleTrybChange}>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='prywatna' id='prywatna' />
          <Label htmlFor='prywatna'>prywatna</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='publiczna' id='publiczna' />
          <Label htmlFor='publiczna'>publiczna</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
