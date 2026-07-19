import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import {
  createPlantSchema,
  CARE_CATEGORIES,
  SUNLIGHT_EXPOSURES,
  PLANT_SIZES,
  POT_MATERIALS,
  LOCATION_TYPES,
  updatePlant,
  type Plant,
  type CreatePlantInput,
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

type EditPlantFormProps = {
  plant: Plant
  onSuccess?: (plant: Plant) => void
}

export function EditPlantForm({ plant, onSuccess }: EditPlantFormProps) {
  const form = useForm<CreatePlantInput>({
    resolver: zodResolver(createPlantSchema),
    defaultValues: {
      name: plant.name,
      species: plant.species,
      careCategory: plant.careCategory,
      sunlight: plant.sunlight,
      size: plant.size,
      pot: plant.pot,
      location: plant.location,
      acquiredAt: plant.acquiredAt,
      notes: plant.notes,
      careCycleOverride: plant.careCycleOverride,
    },
  })

  async function onSubmit(values: CreatePlantInput) {
    const updated = await updatePlant(plant.id, values)
    onSuccess?.(updated)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Grunddaten */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg">Grunddaten</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. Fensterbank-Monstera" {...field} />
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
                <FormLabel>Art / Sorte</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. Monstera Deliciosa" {...field} />
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
                <FormLabel>Pflegekategorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CARE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                <FormLabel>Lichtbedarf</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Lichtbedarf wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUNLIGHT_EXPOSURES.map((exposure) => (
                      <SelectItem key={exposure} value={exposure}>
                        {exposure}
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
                <FormLabel>Pflanzengröße</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Größe wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PLANT_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Topf */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg">Topf</h3>

          <FormField
            control={form.control}
            name="pot.diameterCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durchmesser (cm)</FormLabel>
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
                <FormLabel>Höhe (cm) – optional</FormLabel>
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
                <FormLabel>Material</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Material wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {POT_MATERIALS.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
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
                <FormLabel className="!mt-0">Topf hat Abflussloch</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Standort */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg">Standort</h3>

          <FormField
            control={form.control}
            name="location.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drinnen / Draußen</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                <FormLabel>Raum – optional</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. Wohnzimmer" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Zeitpunkte */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg">Zeitpunkte</h3>

          <FormField
            control={form.control}
            name="acquiredAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Angeschafft am</FormLabel>
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
                          {field.value ? field.value.toLocaleDateString('de-DE') : 'Datum wählen'}
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

        {/* Pflegezyklus-Override */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg">Eigene Pflegezyklen (optional)</h3>
          <p className="text-sm text-muted-foreground">
            Überschreibt den automatisch berechneten Algorithmus mit einem festen Intervall in
            Tagen.
          </p>

          <FormField
            control={form.control}
            name="careCycleOverride.wateringDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gieß-Intervall (Tage)</FormLabel>
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
                <FormLabel>Dünge-Intervall (Tage)</FormLabel>
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
                <FormLabel>Umtopf-Intervall (Tage)</FormLabel>
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

        {/* Notizen */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notizen – optional</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Wird gespeichert …' : 'Änderungen speichern'}
        </Button>
      </form>
    </Form>
  )
}
