#!/bin/bash
cd /home/kavia/workspace/code-generation/petmemoryvault-35582-cdfb4414/pet_memory_vault
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

