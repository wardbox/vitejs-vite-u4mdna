interface Feature {
  name: string;
  description: string;
  icon: string;
  href: string;
};

export default function Features({ features }: { features: Feature[] }) {
  return (
    <div id='features' className='mx-auto mt-48 max-w-7xl px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl text-center'>
        <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
          <span className='text-yellow-500'>100%</span> Open-Source
        </p>
        <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
          No vendor lock-in.
          <br /> Deploy anywhere.
        </p>
      </div>
      <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
        <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
          {features.map((feature) => (
            <a key={feature.name} href={feature.href} className='group'>
              <div className='relative pl-16'>
                <dt className='text-base font-semibold leading-7 text-gray-900 dark:text-white group-hover:underline'>
                  <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center border border-yellow-400 bg-yellow-100/50 dark:bg-boxdark rounded-lg group-hover:border-yellow-500'>
                    <div className='text-2xl group-hover:opacity-80 '>{feature.icon}</div>
                  </div>
                  {feature.name}
                </dt>
                <dd className='mt-2 text-base leading-7 text-gray-600 dark:text-gray-400'>{feature.description}</dd>
              </div>
            </a>
          ))}
        </dl>
      </div>
    </div>
  )
}
