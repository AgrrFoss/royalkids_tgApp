import type { GlobalConfig } from 'payload';
import { isAdmin } from '@/cms/access/isAdmin'
import GlobalRevalidate from '@cms/hooks/revalidateGlobal'
import { textField } from '@cms/fields/textField'
import superLink from '@/shared/Link/config'

const Options: GlobalConfig = {
  slug: 'options',
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [GlobalRevalidate],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Веб-интеграции',
          fields: [
            textField('webMaster', 'Код вебмастера', false, 'Для подтверждения прав на сайт.'),
            textField('yandexMetrikaId', 'id Счетчика', false, 'Предпочтительный метод подключения яндекс метрики'),
            {
              name: 'metrikaCode',
              label: 'Код яндекс метрики',
              type: 'code',
            },
          ]
        }
      ]
    }
  ]
}

export default Options;