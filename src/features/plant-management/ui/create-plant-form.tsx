import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { CalendarIcon } from 'lucide-react'
import {
  CARE_CATEGORIES,
  SUNLIGHT_EXPOSURES,
  PLANT_SIZES,
  POT_MATERIALS,
  LOCATION_TYPES,
  type Plant,
} from '@entities/plant'
import { cn } from '@shared/lib/utils'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { Checkbox } from '@shared/ui/checkbox'
import { Calendar } from '@shared/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/form'
import {
  createPlantFormSchema,
  type CreatePlantFormValues,
} from '../model/create-plant-form-schema'
import { createPlantWithInitialWatering } from '../api/create-plant-with-history'

const defaultValues: CreatePlantFormValues = {
  name: '',
  species: '',
  careCategory: 'other',
  sunlight: 'medium',
  size: 'medium',
  pot: { diameterCm: 12, material: 'plastic', hasDrainageHole: true },
  location: { type: 'indoor' },
  acquiredAt: new Date(),
  lastWateredAt: new Date(),
}

type CreatePlantFormProps = {
  onSuccess?: (plant: Plant) => void
}

export function CreatePlantForm({ onSuccess }: CreatePlantFormProps) {
  const { t, i18n } = useTranslation()
  const form = useForm<CreatePlantFormValues>({
    resolver: zodResolver(createPlantFormSchema),
    defaultValues,
  })

  async function onSubmit(values: CreatePlantFormValues) {
    const plant = await createPlantWithInitialWatering(values)
    form.reset(defaultValues)
    onSuccess?.(plant)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-serif text-lg">{t('plants.form.sectionBasics')}</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('plants.form.namePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.species')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('plants.form.speciesPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="careCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.careCategory')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string | null) =>
                          value
                            ? t(`plants.careCategory.${value}`)
                            : t('plants.form.selectCategory')
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CARE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(`plants.careCategory.${category}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sunlight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.sunlight')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string | null) =>
                          value ? t(`plants.sunlight.${value}`) : t('plants.form.selectSunlight')
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUNLIGHT_EXPOSURES.map((exposure) => (
                      <SelectItem key={exposure} value={exposure}>
                        {t(`plants.sunlight.${exposure}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.size')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string | null) =>
                          value ? t(`plants.size.${value}`) : t('plants.form.selectSize')
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PLANT_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {t(`plants.size.${size}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-lg">{t('plants.form.sectionPot')}</h3>

          <FormField
            control={form.control}
            name="pot.diameterCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.diameter')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pot.heightCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.height')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pot.material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.material')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string | null) =>
                          value ? t(`plants.potMaterial.${value}`) : t('plants.form.selectMaterial')
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {POT_MATERIALS.map((material) => (
                      <SelectItem key={material} value={material}>
                        {t(`plants.potMaterial.${material}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pot.hasDrainageHole"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0">{t('plants.form.hasDrainageHole')}</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-lg">{t('plants.form.sectionLocation')}</h3>

          <FormField
            control={form.control}
            name="location.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.locationType')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string | null) =>
                          value
                            ? t(`plants.locationType.${value}`)
                            : t('plants.form.selectLocationType')
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`plants.locationType.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.room')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('plants.form.roomPlaceholder')}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-lg">{t('plants.form.sectionDates')}</h3>

          <FormField
            control={form.control}
            name="acquiredAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('plants.form.acquiredAt')}</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? field.value.toLocaleDateString(i18n.language)
                            : t('plants.form.pickDate')}
                        </Button>
                      }
                    />
                  </FormControl>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastWateredAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('plants.form.lastWateredAt')}</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? field.value.toLocaleDateString(i18n.language)
                            : t('plants.form.pickDate')}
                        </Button>
                      }
                    />
                  </FormControl>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-lg">{t('plants.form.sectionOverride')}</h3>
          <p className="text-sm text-muted-foreground">{t('plants.form.overrideDescription')}</p>

          <FormField
            control={form.control}
            name="careCycleOverride.wateringDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.wateringDays')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="careCycleOverride.fertilizingDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.fertilizingDays')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="careCycleOverride.repottingDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plants.form.repottingDays')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('plants.form.notes')}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? t('plants.form.submitting') : t('plants.form.submit')}
        </Button>
      </form>
    </Form>
  )
}
