<script lang="ts" setup>
const colorMode = useColorMode()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <template v-if="!colorMode.unknown">
          <template v-if="colorMode.value === 'dark'">
            Dark Mode
          </template>
          <template v-else>
            Light Mode
          </template>
        </template>
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="colorMode.preference = 'light'">
        Light
      </DropdownMenuItem>
      <DropdownMenuItem @click="colorMode.preference = 'dark'">
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem @click="colorMode.preference = 'system'">
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>