export async function window(page,action) {

    let [popup]= await Promise.all([
    page.waitForEvent('popup'),
    action()
    ])

    await popup.waitForLoadState('domcontentloaded')

    return popup
} 