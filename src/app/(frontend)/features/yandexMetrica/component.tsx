'use client'

import { usePathname} from 'next/navigation'
import { useEffect} from 'react'
import ym, { YMInitializer} from 'react-yandex-metrika'

interface YMProps {
  counter?: number
}

const YandexMetrika = ({counter}: YMProps) => {
  const pathname = usePathname();
  const YM_COUNTER_ID = 104693394;
  const counters = counter ? [counter] : [YM_COUNTER_ID];
  useEffect(() => {
    if (pathname) {
      ym("hit", pathname);
    }
  }, [pathname]);

  return <YMInitializer
    accounts={counters}
    options={{
      webvisor: true,
      clickmap: true,
    }}
    version='2'
  />

};

export default YandexMetrika;