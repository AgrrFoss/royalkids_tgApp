import { Config, Plugin } from 'payload'
import RU from './languageObjects/ru'

interface IAddFriendlyUrlParams {
  enable?: boolean
  currentCollections: string[],
  slugField?: {
    slug?: string,
    label?: string,
    inSidebar?: boolean
  }
  rewriteRules?: {
    languageSymbols?: object
    baseLanguage?: 'ru'
    insteadWhiteSpace?: string
  }
}

const addFriendlyUrl = ({enable, currentCollections, slugField, rewriteRules}: IAddFriendlyUrlParams) =>
  (incomingConfig: Config): Config => {
  if (!enable && currentCollections.length === 0){
    return incomingConfig
  } else {
    const config: Config = {
      ...incomingConfig,
      //@ts-ignore
      collections: incomingConfig.collections.map((collection)=>{
        if (collection.slug && currentCollections.includes(collection.slug)){
          return {
            ...collection,
            fields: [
              ...collection.fields,
              {
                name: slugField?.slug ? slugField.slug : 'slug',
                label: slugField?.label ? slugField.label : 'slug',
                type: 'text',
                admin: slugField?.inSidebar && {
                  position: 'sidebar',
                  description: 'заполнится автоматически если оставить пустым'
                },
                unique: true,
                hooks: {
                  beforeChange: [({siblingData, value, req: {user}})=>{
                    if (!value) {
                      let slug: string;
                      const symbolWhiteSpace =
                        rewriteRules?.insteadWhiteSpace || '_';
                      const pureSlug = siblingData?.title
                        ?.toLowerCase()
                        .trim()
                        .replaceAll(' ', symbolWhiteSpace);
                      slug = pureSlug;
                      if (rewriteRules?.baseLanguage === 'ru') {
                        const englishSlug = slug.split('').map((symbol) => {
                          //@ts-ignore
                          if (RU[symbol]){
                            //@ts-ignore
                            return RU[symbol];
                            //@ts-ignore
                          } else if (RU[symbol] === '') {
                            return ''
                          } else {
                            return symbol;
                          }
                        });
                        slug = englishSlug.join('');
                      }
                      return slug;
                    } else {
                      return value
                    }
                  }]
                }
              },
            ],
          }
        } else {
          return collection
        }
      }),
    }
    return config
  }
  }
export default addFriendlyUrl;
